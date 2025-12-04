import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Lightbulb, Globe, Zap } from "lucide-react"

export default function PartnersPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="gradient-bg py-20">
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="text-center">
            <h1 className="mb-4 text-5xl font-bold text-balance">
              <span className="gradient-text">Our Partners</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground text-balance">
              Accelerate Enterprise AI Transformation with the Tangram.ai Partner Network
            </p>
            <p className="text-muted-foreground text-balance">
              Together with our partners, we're revolutionizing how organizations launch artificial intelligence
              initiatives, drive innovation, and achieve unprecedented success.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" className="bg-black text-white hover:bg-black/90">
                BECOME A PARTNER
              </Button>
              <Button size="lg" variant="outline">
                FIND A PARTNER
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Logos Section */}
      <section className="border-b bg-white py-12">
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="text-center">
            <div className="mb-8 text-sm text-muted-foreground">Our Enterprise AI Partners</div>
            <div className="flex flex-wrap items-center justify-center gap-12">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded bg-red-500" />
                <span className="text-xl font-semibold">crayon</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-blue-500" />
                <span className="text-xl font-semibold">Veehive</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded bg-gray-700" />
                <span className="text-xl font-semibold">MOZARK</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Partner With Us */}
      <section className="py-20">
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="text-center">
            <h2 className="mb-4 text-4xl font-bold">Why partner with us</h2>
            <p className="mb-12 text-muted-foreground text-balance">
              With our expertise in AI integration across diverse industries, our partners cater to organizations of all
              sizes, offering comprehensive assistance to integrate Tangram.ai across your business.
            </p>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Card 1 */}
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-black text-white">
                      <Lightbulb className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="mb-3 text-xl font-bold">Accelerate product approvals</h3>
                  <p className="text-sm text-muted-foreground">
                    Work with our partner ecosystem and access industry expertise and resources to help you achieve
                    exceptional results.
                  </p>
                </CardContent>
              </Card>

              {/* Card 2 */}
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-black text-white">
                      <Globe className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="mb-3 text-xl font-bold">Scale your operations globally</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter new markets faster accelerating your business international reach with global partners or
                    local experts.
                  </p>
                </CardContent>
              </Card>

              {/* Card 3 */}
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-black text-white">
                      <Zap className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="mb-3 text-xl font-bold">Get faster business results</h3>
                  <p className="text-sm text-muted-foreground">
                    Reduce time to deployment and accelerate projects with pre-configured, industry-specific solutions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Ecosystem */}
      <section className="bg-gray-50 py-20">
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="text-center">
            <h2 className="mb-4 text-4xl font-bold">Tangram.ai Partner Ecosystem</h2>
            <p className="mb-12 text-muted-foreground">
              Work with thought leaders and innovators in the AI space with our Kona.ai Partners.
            </p>

            {/* Cloud Partners */}
            <div className="mb-16">
              <h3 className="mb-8 text-2xl font-bold">Cloud Partners</h3>
              <div className="flex flex-wrap items-center justify-center gap-12">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded bg-blue-500" />
                  <div className="text-left">
                    <div className="font-semibold">Microsoft</div>
                    <div className="text-sm text-muted-foreground">Azure</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded bg-orange-500" />
                  <div className="text-left">
                    <div className="font-semibold">AWS</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded bg-red-500" />
                  <div className="text-left">
                    <div className="font-semibold">Google Cloud</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resellers and Consulting Partners */}
            <div className="mb-16">
              <h3 className="mb-8 text-2xl font-bold">Resellers and Consulting Partners</h3>
              <p className="mb-8 text-sm text-muted-foreground">
                Tangram.ai and our Partners are transforming the way organizations operate across their data and
                platforms. Our comprehensive partner network offers incentives, deal registration, training, enablement,
                marketing, and joint GTM support.
              </p>
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                {[
                  "LUNTENG",
                  "ALCHEMY",
                  "Crayon",
                  "HARFIYAH",
                  "EchoSo",
                  "Jumberlani",
                  "ITRACE",
                  "arahooti",
                  "BBDG",
                  "CONSULTANT",
                  "CONVERG",
                  "SFI",
                  "ALCHEMY",
                  "Techsalerator",
                  "arahooti",
                  "CONSULTANT",
                ].map((partner, index) => (
                  <div key={index} className="flex items-center justify-center rounded-lg border bg-white p-6">
                    <span className="font-semibold">{partner}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technology Product Partners */}
            <div>
              <h3 className="mb-8 text-2xl font-bold">Technology Product Partners</h3>
              <p className="mb-8 text-sm text-muted-foreground">
                Integrate with the Tangram.ai platform to deliver complementary solutions with enhanced functionality,
                offer greater customer benefits, and step into new markets. Our technology partners get started building
                a best-in-class integration.
              </p>
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                {["snowflake", "databricks", "paloalto", "zoom", "KNOW MORE"].map((partner, index) => (
                  <div key={index} className="flex items-center justify-center rounded-lg border bg-white p-6">
                    <span className="font-semibold">{partner}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accelerate Growth Section */}
      <section className="py-20">
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="text-center">
            <h2 className="mb-12 text-4xl font-bold">Accelerate growth with Tangram.ai</h2>

            <div className="grid gap-12 md:grid-cols-2">
              {/* Vendors Card */}
              <Card>
                <CardContent className="p-8 text-left">
                  <div className="mb-4 text-sm font-semibold uppercase text-muted-foreground">BECOME A VENDOR</div>
                  <h3 className="mb-4 text-2xl font-bold">Tangram.ai ISV</h3>
                  <p className="mb-6 text-muted-foreground">
                    Our partner are certified Tangram.ai channel partner, technology partner, or independent software
                    vendor (ISV).
                  </p>
                  <Button variant="outline">BECOME A ISV</Button>
                </CardContent>
              </Card>

              {/* Reseller Card */}
              <Card>
                <CardContent className="p-8 text-left">
                  <div className="mb-4 text-sm font-semibold uppercase text-muted-foreground">BECOME A RESELLER</div>
                  <h3 className="mb-4 text-2xl font-bold">Tangram.ai Reseller</h3>
                  <p className="mb-6 text-muted-foreground">
                    Our Reseller program allows you to access Tangram.ai resources, support and professional services
                    for your projects.
                  </p>
                  <Button variant="outline">BECOME A RESELLER</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
