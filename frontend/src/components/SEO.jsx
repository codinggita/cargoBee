import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords }) => {
  const siteName = "CargoBee - On-Demand Logistics & Cargo";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription = "CargoBee provides fast, reliable, and secure on-demand cargo logistics. Book a vehicle instantly or join our network as a driver partner.";
  const defaultKeywords = "cargo, logistics, transport, delivery, truck booking, freight, CargoBee";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
    </Helmet>
  );
};

export default SEO;
