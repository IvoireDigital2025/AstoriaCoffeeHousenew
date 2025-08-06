import { useEffect } from "react";
import { updateMetaDescription, updatePageTitle, seoData } from "@/utils/seo";
import MoodSelector from "@/components/mood-selector";

export default function MoodSelectorPage() {
  useEffect(() => {
    updatePageTitle(seoData['mood-selector'].title);
    updateMetaDescription(seoData['mood-selector'].description);
  }, []);

  return <MoodSelector />;
}