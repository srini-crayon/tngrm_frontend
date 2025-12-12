"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { useModal } from "../../../hooks/use-modal";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type ModelDetailApiResponse = {
  success?: boolean;
  data?: {
    model_id?: string;
    model_name?: string;
    blog_title?: string;
    model_icon?: string;
    model_icon_alt?: string | null;
    preview_text?: string;
    tag_line?: string;
    model_description?: string;
    long_description?: string;
    model_type_title?: string;
    model_type_1?: string;
    model_type_2?: string;
    training_data_title?: string;
    training_data_1?: string;
    training_data_2?: string;
    training_data_3?: string;
    training_data_4?: string;
    compatible_agents_title?: string;
    agent_name_1?: string;
    agent_1_image?: string;
    agent_1_image_alt?: string | null;
    agent_name_2?: string;
    agent_2_image?: string;
    agent_2_image_alt?: string | null;
    deployment_mode_title?: string;
    mode_1?: string;
    mode_2?: string;
    mode_3?: string;
    evaluation_metrics_title?: string;
    metrics_1?: string;
    metrics_2?: string;
    metrics_3?: string;
    metrics_4?: string | null;
    built_by?: string;
    built_by_link?: string;
    [key: string]: any;
  };
};

export default function ModelDetailPage() {
  const { openModal } = useModal();
  // Extract id directly to avoid params enumeration issues with React DevTools
  const modelId = useParams()?.id as string | undefined;
  const [modelData, setModelData] = useState<ModelDetailApiResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModelData = async () => {
      if (!modelId) {
        setError("Model ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`https://agents-store.onrender.com/api/models/${modelId}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch model: ${res.status}`);
        }

        const data: ModelDetailApiResponse = await res.json();
        
        if (data.success && data.data) {
          setModelData(data.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching model:", err);
        setError("Failed to load model details");
      } finally {
        setLoading(false);
      }
    };

    fetchModelData();
  }, [modelId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-lg">Loading model details...</div>
      </div>
    );
  }

  if (error || !modelData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Model Not Found</h1>
        <p className="text-muted-foreground mb-6">{error || "This model is not available."}</p>
        <Link href="/agents" className="inline-flex items-center text-blue-600">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Agent Store
        </Link>
      </div>
    );
  }

  // Extract arrays from the data
  const modelTypes: string[] = [];
  if (modelData.model_type_1) modelTypes.push(modelData.model_type_1);
  if (modelData.model_type_2) modelTypes.push(modelData.model_type_2);

  const trainingData: string[] = [];
  if (modelData.training_data_1) trainingData.push(modelData.training_data_1);
  if (modelData.training_data_2) trainingData.push(modelData.training_data_2);
  if (modelData.training_data_3) trainingData.push(modelData.training_data_3);
  if (modelData.training_data_4) trainingData.push(modelData.training_data_4);

  const deploymentModes: string[] = [];
  if (modelData.mode_1) deploymentModes.push(modelData.mode_1);
  if (modelData.mode_2) deploymentModes.push(modelData.mode_2);
  if (modelData.mode_3) deploymentModes.push(modelData.mode_3);

  const evaluationMetrics: string[] = [];
  if (modelData.metrics_1) evaluationMetrics.push(modelData.metrics_1);
  if (modelData.metrics_2) evaluationMetrics.push(modelData.metrics_2);
  if (modelData.metrics_3) evaluationMetrics.push(modelData.metrics_3);
  if (modelData.metrics_4) evaluationMetrics.push(modelData.metrics_4);

  const compatibleAgents: Array<{ name: string; image?: string; imageAlt?: string | null }> = [];
  if (modelData.agent_name_1) {
    compatibleAgents.push({
      name: modelData.agent_name_1,
      image: modelData.agent_1_image,
      imageAlt: modelData.agent_1_image_alt,
    });
  }
  if (modelData.agent_name_2) {
    compatibleAgents.push({
      name: modelData.agent_name_2,
      image: modelData.agent_2_image,
      imageAlt: modelData.agent_2_image_alt,
    });
  }

  // Strip HTML tags from long_description for display
  const stripHtml = (html: string | undefined) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").trim();
  };

  const description = stripHtml(modelData.long_description) || modelData.preview_text || modelData.tag_line || "";

  return (
    <div className="flex flex-col relative min-h-screen bg-white">
      {/* Main Content */}
      <section 
        className="relative py-12"
        style={{
          position: "relative",
        }}
      >
        {/* Top radial gradient background */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: "100%",
            height: "360px",
            top: 0,
            left: 0,
            background: "radial-gradient(100% 100% at 50% 0%, #E5E5FF 0%, #FFF 100%)",
            opacity: 1,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div className="w-full px-8 md:px-12 lg:px-16 mx-auto" style={{ maxWidth: "1407px", position: "relative", zIndex: 1 }}>
          {/* Breadcrumb */}
          <Link 
            href="/agents" 
            className="inline-flex items-center mb-6"
            style={{
              color: '#6B7280',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '150%',
            }}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Agent Store
          </Link>

          {/* Model Title Section */}
          <div className="mb-6">
            {/* Model Icon */}
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "8px",
                background: "#FED1E6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                marginBottom: "16px",
                overflow: "hidden",
              }}
            >
              {modelData.model_icon ? (
                <Image
                  src={modelData.model_icon}
                  alt={modelData.model_icon_alt || modelData.blog_title || "Model icon"}
                  width={64}
                  height={64}
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "100%",
                  }}
                  unoptimized
                />
              ) : (
                <span>💳</span>
              )}
            </div>

            {/* Title and Metadata */}
            <div>
              <h1 
                style={{
                  color: 'var(--Interface-Color-Primary-900, #091917)',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '52px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: '54px',
                  letterSpacing: '-1.04px',
                  marginBottom: '8px',
                }}
              >
                {modelData.blog_title || modelData.model_name || "Model"}
              </h1>
              
              <div className="flex items-center gap-2 mb-3">
                <span 
                  style={{
                    color: '#091917',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: 'normal',
                  }}
                >
                  Model
                </span>
                {modelData.built_by && (
                  <>
                    <span 
                      style={{
                        color: '#E3E3E3',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '14px',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        lineHeight: 'normal',
                      }}
                    >
                      |
                    </span>
                    <span 
                      style={{
                        color: '#091917',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '14px',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        lineHeight: 'normal',
                      }}
                    >
                      Built by
                    </span>
                    {modelData.built_by_link ? (
                      <a
                        href={modelData.built_by_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#155EEF',
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '14px',
                          fontStyle: 'normal',
                          fontWeight: 500,
                          lineHeight: 'normal',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                        }}
                      >
                        {modelData.built_by}
                      </a>
                    ) : (
                      <span
                        style={{
                          color: '#091917',
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '14px',
                          fontStyle: 'normal',
                          fontWeight: 500,
                          lineHeight: 'normal',
                        }}
                      >
                        {modelData.built_by}
                      </span>
                    )}
                  </>
                )}
              </div>

              <p
                style={{
                  color: '#6B7280',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '20px',
                }}
              >
                {modelData.preview_text || modelData.tag_line || ""}
              </p>
            </div>
          </div>

          {/* Model Description Section */}
          {description && (
            <div className="mb-8">
              <h2
                style={{
                  color: '#091917',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '18px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: 'normal',
                  marginBottom: '12px',
                }}
              >
                Model Description
              </h2>
              <p
                style={{
                  color: '#091917',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '24px',
                  maxWidth: '800px',
                }}
              >
                {description}
              </p>
            </div>
          )}

          {/* Model Type Section */}
          {modelTypes.length > 0 && (
            <div className="mb-8">
              <h2
                style={{
                  color: '#091917',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '18px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: 'normal',
                  marginBottom: '12px',
                }}
              >
                {modelData.model_type_title || "Model Type"}
              </h2>
              <div className="flex flex-wrap gap-2">
                {modelTypes.map((type, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: '#F3F4F6',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      lineHeight: '20px',
                      color: '#091917',
                    }}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Training Data Section */}
          {trainingData.length > 0 && (
            <div className="mb-8">
              <h2
                style={{
                  color: '#091917',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '18px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: 'normal',
                  marginBottom: '12px',
                }}
              >
                {modelData.training_data_title || "Training Data"}
              </h2>
              <div className="flex flex-wrap gap-2">
                {trainingData.map((data, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: '#F3F4F6',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      lineHeight: '20px',
                      color: '#091917',
                    }}
                  >
                    {data}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Compatible Agents Section */}
          {compatibleAgents.length > 0 && (
            <div className="mb-8">
              <h2
                style={{
                  color: '#091917',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '18px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: 'normal',
                  marginBottom: '12px',
                }}
              >
                {modelData.compatible_agents_title || "Compatible Agents"}
              </h2>
              <div className="flex flex-wrap gap-4">
                {compatibleAgents.map((agent, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: '351px',
                      height: '81px',
                      flexShrink: 0,
                      borderRadius: '16px',
                      background: '#F9FAFB',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: idx === 0 ? '#FED1E6' : '#E9D5FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        flexShrink: 0,
                        overflow: 'hidden',
                      }}
                    >
                      {agent.image ? (
                        <Image
                          src={agent.image}
                          alt={agent.imageAlt || agent.name}
                          width={40}
                          height={40}
                          style={{
                            objectFit: "contain",
                            width: "100%",
                            height: "100%",
                          }}
                          unoptimized
                        />
                      ) : (
                        <span>💳</span>
                      )}
                    </div>
                    <span
                      style={{
                        color: '#091917',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '14px',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        lineHeight: '20px',
                      }}
                    >
                      {agent.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deployment Mode Section */}
          {deploymentModes.length > 0 && (
            <div className="mb-8">
              <h2
                style={{
                  color: '#091917',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '18px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: 'normal',
                  marginBottom: '12px',
                }}
              >
                {modelData.deployment_mode_title || "Deployment Mode"}
              </h2>
              <div className="flex flex-wrap gap-2">
                {deploymentModes.map((mode, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: '#F3F4F6',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      lineHeight: '20px',
                      color: '#091917',
                    }}
                  >
                    {mode}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Evaluation Metrics Section */}
          {evaluationMetrics.length > 0 && (
            <div className="mb-12">
              <h2
                style={{
                  color: '#091917',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '18px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: 'normal',
                  marginBottom: '12px',
                }}
              >
                {modelData.evaluation_metrics_title || "Evaluation Metrics"}
              </h2>
              <div className="flex flex-wrap gap-2">
                {evaluationMetrics.map((metric, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: '#F3F4F6',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      lineHeight: '20px',
                      color: '#091917',
                    }}
                  >
                    {metric}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Custom Services CTA Section */}
      <section
        className="py-10 px-4 md:py-[50px] md:px-5 lg:py-20 lg:px-0"
        style={{
          width: "100%",
          background: "#FFFFFF",
          position: "relative",
          margin: "0 auto",
          textRendering: "optimizeLegibility",
          WebkitFontSmoothing: "antialiased",
          boxSizing: "border-box",
          overflow: "visible",
          display: "block",
          visibility: "visible",
          minHeight: "400px",
        }}
      >
        {/* Pattern Background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundImage: "url('/img/bgpattern.svg')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundSize: "contain",
            opacity: 1,
            zIndex: 0,
            pointerEvents: "none",
            width: "100%",
            maxWidth: "1356px",
            height: "100%",
          }}
        />
        
        {/* Outer Container */}
        <div
          className="p-10 px-6 md:p-[60px] md:px-8 lg:p-[70px] lg:px-12"
          style={{
            width: "100%",
            maxWidth: "1232px",
            margin: "0 auto",
            position: "relative",
            border: "none",
            borderRadius: 0,
            background: "transparent",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0,
            boxSizing: "border-box",
            zIndex: 1,
            opacity: 1,
            visibility: "visible",
          }}
        >
          {/* Header Section */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              width: "100%",
              marginBottom: "32px",
              boxSizing: "border-box",
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* Top Pill Badge */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "auto",
                height: "28px",
                minWidth: "fit-content",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  padding: "5.8px 8px 6.79px 8px",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "12px",
                  fontWeight: 500,
                  fontStyle: "normal",
                  lineHeight: "14.4px",
                  letterSpacing: "0%",
                  textAlign: "center",
                  verticalAlign: "middle",
                  color: "#0b2b70",
                  background: "#d0dff7",
                  backdropFilter: "blur(3px)",
                  WebkitBackdropFilter: "blur(3px)",
                  border: "none",
                  borderRadius: "20px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxSizing: "border-box",
                  whiteSpace: "nowrap",
                }}
              >
                Enquire Now
              </div>
            </div>

            {/* Main Heading */}
            <h1
              className="md:text-[28px] md:leading-[39.2px] md:tracking-[-0.56px] md:px-20 md:whitespace-normal text-[24px] leading-[33.6px] tracking-[-0.48px] px-4 whitespace-normal lg:text-[32px] lg:leading-[44.8px] lg:tracking-[-0.64px] lg:px-[165px] lg:pl-[171.34px] lg:whitespace-nowrap"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontStyle: "normal",
                textAlign: "center",
                verticalAlign: "middle",
                background: "linear-gradient(to left, #0082c0 0%, #3b60af 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "#0082c0",
                margin: 0,
                width: "100%",
                maxWidth: "100%",
                overflow: "visible",
                boxSizing: "border-box",
              }}
            >
              Want a Custom Workflow?
            </h1>

            {/* Subtitle */}
            <p
              className="text-sm leading-[21px] md:text-[15px] md:leading-[22.5px] lg:text-base lg:leading-6"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                letterSpacing: "0%",
                textAlign: "center",
                verticalAlign: "middle",
                color: "#6b7280",
                margin: 0,
                width: "100%",
                maxWidth: "880px",
                position: "relative",
              }}
            >
              Tangram agents can be chained into complete, composable solutions. Tell us what outcome you want — we'll build the right flow.
            </p>
          </div>

          {/* Button Group */}
          <div
            className="flex-col gap-3 w-full md:flex-row md:gap-4"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 0,
              boxSizing: "border-box",
              position: "relative",
              zIndex: 2,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                position: "relative",
                background: "rgba(121, 133, 171, 0.05)",
                borderRadius: "4px",
                padding: "2px",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: "-2px",
                  background: "rgba(121, 133, 171, 0.05)",
                  borderRadius: "4px",
                  filter: "blur(7.5px)",
                  zIndex: -1,
                }}
              />
              <button
                onClick={() => openModal("auth", { mode: "signup", role: "client" })}
                style={{
                  position: "relative",
                  height: "44px",
                  padding: "0 28px",
                  zIndex: 1,
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "14px",
                  lineHeight: "21px",
                  letterSpacing: "0%",
                  color: "#FFFFFF",
                  background: "black",
                  border: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  whiteSpace: "nowrap",
                  boxSizing: "border-box",
                  borderRadius: "4px",
                  textDecoration: "none",
                  cursor: "pointer",
                  pointerEvents: "auto",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                Talk to Solution Architect
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
