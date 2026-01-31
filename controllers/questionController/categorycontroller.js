// import categorymodel from "../../models/examModel/categorymodel";
// import Exammodel from "../../models/examModel/Exammodel";

import categorymodel from "../../models/examModel/categorymodel.js";

export const getcategoryController = async (req, res) => {
  try {
    const categories = await categorymodel.find({status:true});
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
    const category = await categorymodel.create({
      name,
      slug,
      categoryDetails,
    });
    res.status(201).json({
      success: true,
      message: "category upload successfuly",
      data: { category },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateCategory = async (req, res, next) => {
  try {
    let { name, slug, categoryDetails,categoryID, status } = req.body;

    if (!categoryID) {
       res.status(401).json({
        seccess: false,
        message: " please provide categoryID",
      });
    }
    const iscategory = await categorymodel.findOneAndUpdate({_id:categoryID, name,
      slug,
      categoryDetails,
      status,
  });

    if (!iscategory) {
      res.status(404).json({
        seccess: false,
        message: "This category not exits",
      });
    }
    // update Test
    // const category = await categorymodel.updateOne({
    //   // _id:categoryID,
    //   name,
    //   slug,
    //   categoryDetails,
    //   status,
    //   categoryID
    // });

    res.status(201).json({
      success: true,
      message: "category updated successfuly",
      data: { iscategory },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
