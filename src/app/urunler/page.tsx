import { fetchMaskeMuzikProducts } from "@/services/productService";
import { fetchLayoutSettings } from "@/services/layoutService";
import UrunlerClient from "../../components/UrunlerClient";

export default async function UrunlerPage() {
  const products = await fetchMaskeMuzikProducts();
  const layoutSettings = await fetchLayoutSettings();

  return <UrunlerClient products={products} layoutSettings={layoutSettings} />;
}
