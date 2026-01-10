// Backend/controllers/membershipPlanController.js
import MembershipPlan from "../models/MembershipPlan.js";

export const createPlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.create(req.body);
    res.status(201).json(plan);
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to create plan" });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json(plan);
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to update plan" });
  }
};

export const deletePlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findByIdAndUpdate(req.params.id, {
      isActive: false,
    });
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json({ message: "Plan deactivated" });
  } catch {
    res.status(400).json({ message: "Failed to delete plan" });
  }
};

export const getPlans = async (_req, res) => {
  try {
    const plans = await MembershipPlan.find().sort({ createdAt: -1 });
    res.json(plans);
  } catch {
    res.status(400).json({ message: "Failed to fetch plans" });
  }
};
