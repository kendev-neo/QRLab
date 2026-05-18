module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./app/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                cream: "#FFF8F0",
                "cream-deep": "#F4F1ED",
                ink: "#4A4658",
                "ink-soft": "#8B8799",
                "ink-faint": "#B8B4C4",
                mint: "#10B981",
                "mint-deep": "#059669",
                lavender: "#A78BFA",
                peach: "#FB923C",
                "peach-deep": "#F472B6",
                rose: "#F43F5E",
                blush: "#FFE6E1",
                lilac: "#F1ECFF",
                "mint-air": "#E6F6EF",
                "sky-air": "#EAF3FF",
                butter: "#FFF7DA",
                pearl: "#F4F1ED",
            },
            fontFamily: {
                sans: [
                    "Geist",
                    "-apple-system",
                    "BlinkMacSystemFont",
                    "Segoe UI",
                    "Roboto",
                    "sans-serif",
                ],
                display: [
                    "Quicksand",
                    "-apple-system",
                    "BlinkMacSystemFont",
                    "Segoe UI",
                    "Roboto",
                    "sans-serif",
                ],
            },
            borderRadius: {
                card: "0.75rem",
                sm: "0.25rem",
                lg: "1rem",
                full: "9999px",
            },
            boxShadow: {
                soft: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            },
        },
    },
    plugins: [],
};
