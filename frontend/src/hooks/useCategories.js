import { useEffect, useState } from "react";
import api from "../api/axios";

let cache = null;
let inflight = null;

export default function useCategories() {
  const [cats, setCats] = useState(cache || []);
  useEffect(() => {
    if (cache) return;
    inflight = inflight || api.get("/categories").then((r) => (cache = r.data));
    inflight.then((d) => setCats(d)).catch(() => {});
  }, []);
  return cats;
}
