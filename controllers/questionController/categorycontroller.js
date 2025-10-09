// import categorymodel from "../../models/examModel/categorymodel";
// import Exammodel from "../../models/examModel/Exammodel";

import categorymodel from "../../models/examModel/categorymodel.js";

export const getcategoryController = async (req, res) => {
  try {
    const categories = await categorymodel.find();

    if (categories) {
      res.status(200).json({
        success: true,
        message: "category list fetch successfuly",
        data: { categories },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: {} });
  }
};

//  for category upload
export const createCategory = async (req, res, next) => {
  try {
    let { name, slug, categoryDetails } = req.body;
    slug = slug.toLowerCase();
    const iscategory = await categorymodel.findOne({ slug: slug });

    if (iscategory) {
      res.status(202).json({
        seccess: false,
        message: "category already exits",
      });
    }
    // Create Test
    const category = await categorymodel.create({ name, slug, categoryDetails });
    res.status(201).json({
      success: true,
      message: "category upload successfuly",
      data: { category },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
