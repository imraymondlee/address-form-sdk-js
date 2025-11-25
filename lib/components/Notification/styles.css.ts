import { style } from "@vanilla-extract/css";

export const notification = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0.5rem 0.75rem",
  backgroundColor: "#fee",
  border: "1px solid #fcc",
  borderRadius: "0.25rem",
  marginBottom: "0.5rem",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
});

export const message = style({
  flex: 1,
  color: "#c00",
  fontSize: "0.8rem",
});

export const closeButton = style({
  background: "none",
  border: "none",
  color: "#c00",
  fontSize: "1rem",
  cursor: "pointer",
  padding: "0.2rem",
  lineHeight: 1,
  ":hover": {
    opacity: 0.75,
  },
});
