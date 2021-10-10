import constants from "../constants.json";

export const checkItem = async (Collection, name) => {
  const alreadyExists = await Collection.find({ name: name });
  if (alreadyExists.length > 0) return true;
  return false;
};

export const getAllItems = async (Collection, res, populate) => {
  try {
    const allItems = populate
      ? await Collection.find().populate()
      : await Collection.find();
    if (allItems.length) return res.status(200).json(allItems);
    if (!allItems.length)
      return res.status(404).json({ error: constants.mongodb.dbEmpty });
  } catch (err) {
    return res
      .status(500)
      .json({ error: constants.error.internalError, info: err.message });
  }
};

export const addItem = async (Collection, inputItem, res) => {
  try {
    if (await checkItem(Collection, inputItem.name)) {
      return res.status(409).json({ error: constants.mongodb.dbItemExists });
    } else {
      const newItem = await new Collection({
        name: inputItem?.name,
        imagePath: inputItem?.imagePath,
        description: inputItem?.description,
        isActive: inputItem?.isActive,
        question: inputItem?.question,
        answer: inputItem?.answer,
        privacyPolicy: inputItem?.privacyPolicy,
        quantity: inputItem?.quantity,
        size: inputItem?.size,
        price: inputItem?.price,
        discountPrice: inputItem?.discountPrice,
        faq: inputItem?.faq,
        category: inputItem?.category,
        postid: inputItem?.postid,
        title: inputItem?.title,
        content: inputItem?.content, 
        image: inputItem?.image,
        profilePicture: inputItem?.profilePicture,
        subid: inputItem?.subid, 
        userid: inputItem?.userid, 
        content: inputItem?.content, 
        uploaddate: inputItem?.uploaddate, 
        comments: inputItem?.comments,
        commentid: inputItem?.commentid
      });
      const savedItem = await newItem.save();
      return res
        .status(200)
        .json({ info: constants.mongodb.dbItemSuccess, savedItem });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: constants.error.internalError, info: err.message });
  }
};

export const randomNumGen = (len, arr) => {
  let ans = "";
  for (let i = len; i > 0; i--) {
    ans += arr[Math.floor(Math.random() * arr.length)];
  }
  return ans;
};

export const editItem = async (Collection, index, updateItem, res) => {
  try {
    const editedItem = await Collection.findByIdAndUpdate(index, updateItem, {
      new: true,
    });
    if (editedItem) return res.status(200).json(editedItem);
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

export const deleteItem = async (Collection, id, res) => {
  try {
    const deletedItem = await Collection.findByIdAndDelete(id);
    if (!!deletedItem)
      return res.status(200).json({ msg: constants.mongodb.dbDelSuccess });
    if (!deletedItem)
      return res.status(404).json({ err: constants.mongodb.dbItemNotFound });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
