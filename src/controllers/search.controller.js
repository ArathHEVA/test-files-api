import { searchImages } from "../services/unsplash.service.js";

export async function search(req, res, next) {
  try {
    const { query, page = 1, perPage = 10 } = req.query;
    const out = await searchImages(query || "", Number(page), Number(perPage));
    res.status(200).send(
      { success: true,
        message: "Images searched successfully",
        data: out
      }
    );
  } catch (err) { next(err); }
}
