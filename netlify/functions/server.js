#!/usr/bin/env node

/**
 * Netlify serverless function for React Router 7 SSR
 * This file handles server-side rendering for the resume analyzer app
 */

const { createRequestHandler } = require("@react-router/node");

// Import the server build
const build = require("./build/server/index.js");

const handler = createRequestHandler({
  build,
  mode: process.env.NODE_ENV === "development" ? "development" : "production",
});

exports.handler = async (event, context) => {
  // Convert Netlify event to standard Request
  const url = new URL(event.rawUrl || `https://${event.headers.host}${event.path}`);
  
  // Add query parameters
  if (event.multiValueQueryStringParameters) {
    Object.entries(event.multiValueQueryStringParameters).forEach(([key, values]) => {
      values.forEach(value => url.searchParams.append(key, value));
    });
  } else if (event.queryStringParameters) {
    Object.entries(event.queryStringParameters || {}).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });
  }

  const request = new Request(url.href, {
    method: event.httpMethod,
    headers: new Headers(event.headers),
    body: event.body ? 
      (event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body) : 
      undefined,
  });

  try {
    // Handle the request with React Router
    const response = await handler(request);
    
    // Convert Response to Netlify format
    const body = await response.text();
    
    return {
      statusCode: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body,
      isBase64Encoded: false,
    };
  } catch (error) {
    console.error("Error handling request:", error);
    
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "text/html",
      },
      body: `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Server Error</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              .error { background: #fee; border: 1px solid #fcc; padding: 20px; border-radius: 8px; }
            </style>
          </head>
          <body>
            <div class="error">
              <h1>Server Error</h1>
              <p>Something went wrong. Please try again later.</p>
            </div>
          </body>
        </html>
      `,
    };
  }
};