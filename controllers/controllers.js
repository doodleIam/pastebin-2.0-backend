import mongoose from "mongoose";
import { getNow } from "../utils/helper.js";
import { Paste } from "../models/pastemodel.js";
import escapeHtml from "escape-html";

export const check = async (req, res) => {
  const ok = mongoose.connection.readyState === 1;
  res.status(200).json({ ok });
};

export const createPaste = async (req, res) => {
  try {
    const { content, ttl_seconds, max_views } = req.body;

    const now = getNow(req);

    const paste = new Paste({
      content,
      expiresAt: ttl_seconds
        ? new Date(now.getTime() + ttl_seconds * 1000)
        : null,
      maxViews: max_views ?? null,
    });

    await paste.save()

    res.status(201).json({
      id: paste._id.toString(),
      url: `${req.protocol}://${req.get("host")}/p/${paste._id}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal server error" });
  }
};

export const fetchPasteAndCountView = async(req, res) => {

  const { id } = req.params
  const now = getNow(req);

  const paste = await Paste.findById(id);
  if (!paste) return null;

  if (paste.expiresAt && paste.expiresAt <= now) {
    return null;
  }

  if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
    return null;
  }

  const updated = await Paste.findOneAndUpdate(
    {
      _id: id,
      ...(paste.maxViews !== null && { viewCount: { $lt: paste.maxViews } }),
    },
    { $inc: { viewCount: 1 } },
    { new: true }
  );

  return updated;
}

export const getPaste = async (req, res) => {
  try {
    const paste = await fetchPasteAndCountView(req);

    if (!paste) {
      return res.status(404).json({ error: "Paste not found" });
    }

    const remainingViews =
      paste.maxViews === null
        ? null
        : Math.max(paste.maxViews - paste.viewCount, 0);

    res.status(200).json({
      content: paste.content,
      remaining_views: remainingViews,
      expires_at: paste.expiresAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal server error" });
  }
};

export const viewPaste = async (req, res) => {
  try {
    const paste = await fetchPasteAndCountView(req);

    if (!paste) {
      return res.status(404).send("Paste not found");
    }

    res.status(200).send(`
      <html>
        <body>
          <pre>${escapeHtml(paste.content)}</pre>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
