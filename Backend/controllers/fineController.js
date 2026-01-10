// Backend/controllers/fineController.js
import Fine from "../models/Fine.js";
import { payFine } from "../services/fineService.js";

export const listFines = async (req, res) => {
  try {
    const { memberId, status } = req.query;
    const filter = {};
    if (memberId) filter.member = memberId;
    if (status) filter.status = status;

    const fines = await Fine.find(filter)
      .populate("member", "name email")
      .populate("borrowRecord")
      .sort({ createdAt: -1 });

    res.json(fines);
  } catch {
    res.status(400).json({ message: "Failed to fetch fines" });
  }
};

export const payFineController = async (req, res) => {
  try {
    const { fineId } = req.params;
    const { amount } = req.body;
    const updated = await payFine(fineId, Number(amount));
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to pay fine" });
  }
};
