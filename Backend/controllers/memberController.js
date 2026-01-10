// Backend/controllers/memberController.js
import Member from "../models/Member.js";
import MembershipPlan from "../models/MembershipPlan.js";

// Create a new member
export async function createMember(req, res) {
  try {
    const { name, email, phone, address, planId, plan } = req.body;

    // Support both 'plan' and 'planId' from the client
    const planObjectId = plan || planId;
    if (!planObjectId) {
      return res.status(400).json({ message: "plan or planId is required" });
    }

    const membershipPlan = await MembershipPlan.findById(planObjectId);
    if (!membershipPlan) {
      return res.status(404).json({ message: "Membership plan not found" });
    }

    // Compute expiry date from plan duration
    const joinDate = new Date();
    const expiryDate = new Date(
      joinDate.getTime() + membershipPlan.durationInDays * 24 * 60 * 60 * 1000
    );

    const member = await Member.create({
      name,
      email,
      phone,
      address,
      plan: membershipPlan._id,
      joinDate,
      expiryDate,
      isActive: true,
      totalOutstandingFine: 0,
      totalPaidFine: 0,
    });

    res.status(201).json(member);
  } catch (err) {
    console.error("Error creating member:", err);
    res
      .status(500)
      .json({ message: "Failed to create member", error: err.message });
  }
}

// Update an existing member
export async function updateMember(req, res) {
  try {
    const { id } = req.params;
    const { name, email, phone, address, planId, plan, isActive } = req.body;

    const update = { name, email, phone, address, isActive };

    const planObjectId = plan || planId;
    if (planObjectId) {
      const membershipPlan = await MembershipPlan.findById(planObjectId);
      if (!membershipPlan) {
        return res.status(404).json({ message: "Membership plan not found" });
      }
      update.plan = membershipPlan._id;
      // Optionally recompute expiry date
      update.expiryDate = new Date(
        Date.now() + membershipPlan.durationInDays * 24 * 60 * 60 * 1000
      );
    }

    const member = await Member.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.json(member);
  } catch (err) {
    console.error("Error updating member:", err);
    res
      .status(500)
      .json({ message: "Failed to update member", error: err.message });
  }
}

// Delete a member
export async function deleteMember(req, res) {
  try {
    const { id } = req.params;
    const member = await Member.findByIdAndDelete(id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting member:", err);
    res
      .status(500)
      .json({ message: "Failed to delete member", error: err.message });
  }
}

// Get all members
export async function getMembers(req, res) {
  try {
    const members = await Member.find().populate("plan");
    res.json(members);
  } catch (err) {
    console.error("Error fetching members:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch members", error: err.message });
  }
}

// Get a member by id
export async function getMemberById(req, res) {
  try {
    const { id } = req.params;
    const member = await Member.findById(id).populate("plan");
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.json(member);
  } catch (err) {
    console.error("Error fetching member:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch member", error: err.message });
  }
}
