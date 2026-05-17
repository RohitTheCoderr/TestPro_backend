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

//  for admin
export const getcategoriesController = async (req, res) => {
  try {
    const categories = await categorymodel.find();
    if (categories) {
      res.status(200).json({
        success: true,
        message: "categories fetch successfuly",
        data: { categories },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: {} });
  }
};

export const getSingleCategoryController = async (req, res) => {
  try {
    const { categoryID } = req.params;
    const category = await categorymodel.findById(categoryID);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      data: { category },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: {} });
  }
};


export const createCategory = async (req, res, next) => {
  try {
    let { name, slug, categoryDetails, status } = req.body;
    if (!name && !slug) {
      return res.status(404).json({
        seccess: false,
        message: "Please provide category Name or slug",
      });
    }
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
      status,
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

//  for category upload
export const updateCategory = async (req, res) => {
  try {
    let { name, slug, categoryDetails, status, categoryID } = req.body;
 
    if (!categoryID) {
      return res.status(400).json({
        success: false,
        message: "categoryID is required",
      });
    }

    if (slug) slug = slug.toLowerCase();

    // 🔍 Check duplicate (except current category)
    const duplicateCategory = await categorymodel.findOne({
      _id: { $ne: categoryID },   // exclude current category
      $or: [{ name }, { slug }],
    });

    if (duplicateCategory) {
      return res.status(409).json({
        success: false,
        message: "Category name or slug already exists",
      });
    }
 
    const category = await categorymodel.findByIdAndUpdate(
      categoryID,
      {
        name,
        slug,
        categoryDetails,
        status,
      },
      {
        new: true,       // return updated doc
        runValidators: true,
      }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not exists",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}