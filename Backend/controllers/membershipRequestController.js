// Backend/controllers/membershipRequestController.js
import MembershipRequest from "../models/MembershipRequest.js";
import MembershipPlan from "../models/MembershipPlan.js";
import Member from "../models/Member.js";

// STUDENT: create a membership request
export async function createMembershipRequest(req, res) {
  try {
    const { planId } = req.body;
    if (!planId) {
      return res.status(400).json({ message: "planId is required" });
    }

    const plan = await MembershipPlan.findById(planId);
    if (!plan || !plan.isActive) {
      return res.status(404).json({ message: "Membership plan not found" });
    }

    // Prevent multiple active/pending requests for this user
    const existing = await MembershipRequest.findOne({
      user: req.user.id,
      status: { $in: ["pending", "approved"] },
    });
    if (existing) {
      return res.status(400).json({
        message:
          "You already have a membership request in progress or an active membership.",
      });
    }

    const request = await MembershipRequest.create({
      user: req.user.id,
      plan: plan._id,
    });

    res.status(201).json(request);
  } catch (err) {
    console.error("Error creating membership request:", err);
    res.status(500).json({ message: "Failed to create membership request" });
  }
}

// STUDENT: get my own membership requests
export async function getMyMembershipRequests(req, res) {
  try {
    const requests = await MembershipRequest.find({ user: req.user.id })
      .populate("plan")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error("Error fetching my membership requests:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch membership requests" });
  }
}

// ADMIN: get all membership requests
export async function getAllMembershipRequests(req, res) {
  try {
    const requests = await MembershipRequest.find()
      .populate("user", "name email")
      .populate("plan")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error("Error fetching all membership requests:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch membership requests" });
  }
}

// ADMIN: approve or reject a membership request
export async function updateMembershipRequestStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body; // "approved" | "rejected"

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await MembershipRequest.findById(id)
      .populate("plan")
      .populate("user");
    if (!request) {
      return res.status(404).json({ message: "Membership request not found" });
    }

    request.status = status;
    await request.save();

    // If approved, create Member document
    if (status === "approved") {
      const joinDate = new Date();
      const expiryDate = new Date(
        joinDate.getTime() + request.plan.durationInDays * 24 * 60 * 60 * 1000
      );

      await Member.create({
        name: request.user.name,
        email: request.user.email,
        phone: "",
        address: "",
        plan: request.plan._id,
        joinDate,
        expiryDate,
        isActive: true,
      });
    }

    res.json(request);
  } catch (err) {
    console.error("Error updating membership request status:", err);
    res
      .status(500)
      .json({ message: "Failed to update membership request" });
  }
}
