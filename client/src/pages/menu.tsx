import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

export default function Menu() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadMenu = () => {
    // For now, this will show a message about the menu being available
    // Once you provide a smaller PDF or upload it to a file hosting service,
    // we can link to it here
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Menu download will be available soon. Please visit us at 23-33 Astoria Blvd, Astoria, NY 11102 for our full menu!");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-amber-900 dark:text-amber-100 mb-4">
            Coffee Pro Menu
          </h1>
          <p className="text-lg text-amber-700 dark:text-amber-300 max-w-2xl mx-auto">
            Discover our authentic Middle Eastern coffee, pastries, and specialties 
            inspired by the ancient beauty of AlUla, Saudi Arabia.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl border-amber-200 dark:border-amber-800">
            <CardHeader className="text-center bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900">
              <CardTitle className="text-2xl text-amber-900 dark:text-amber-100 flex items-center justify-center gap-2">
                <FileText className="w-6 h-6" />
                Our Complete Menu
              </CardTitle>
              <CardDescription className="text-amber-700 dark:text-amber-300">
                Experience the flavors of Saudi Arabian heritage
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="bg-amber-50 dark:bg-slate-800 rounded-lg p-6 border border-amber-200 dark:border-amber-700">
                  <h3 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-3">
                    Featured Specialties
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-amber-700 dark:text-amber-300">
                    <div>
                      <p className="font-medium">Arabic Coffee (Qahwa)</p>
                      <p>Traditional Saudi Arabian coffee</p>
                    </div>
                    <div>
                      <p className="font-medium">Dubai Pistachio Specialties</p>
                      <p>Authentic Middle Eastern pastries</p>
                    </div>
                    <div>
                      <p className="font-medium">AlUla Heritage Selections</p>
                      <p>Inspired by ancient Saudi culture</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className="text-amber-700 dark:text-amber-300">
                    Our full menu showcases 32+ years of culinary heritage with authentic 
                    Middle Eastern flavors and modern coffee culture.
                  </p>
                  
                  <Button
                    onClick={handleDownloadMenu}
                    className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                    disabled={isLoading}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    {isLoading ? "Loading..." : "Download Menu"}
                  </Button>
                  
                  <div className="mt-6 p-4 bg-amber-100 dark:bg-amber-900 rounded-lg">
                    <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                      Visit Us Today
                    </h4>
                    <p className="text-amber-700 dark:text-amber-300">
                      📍 23-33 Astoria Blvd, Astoria, NY 11102
                    </p>
                    <p className="text-amber-700 dark:text-amber-300">
                      Experience our complete menu in person with authentic Saudi Arabian hospitality
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}