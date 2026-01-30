# Offline Flexbox Playground

An offline tool to configure Flexbox and positioning options from a control panel and see the result in real time.
It helps you learn Flexbox and quickly generate CSS visually, without needing an internet connection.

## Features

- Visual controls for:
	- `display`
	- Flexbox: `flex-direction`, `justify-content`, `align-items`, `flex-wrap`, `gap`
	- Positioning: `position`, `top`, `right`, `bottom`, `left`
- Live preview of the layout
- Custom CSS area for extra declarations
- One-click copy of the generated CSS
- Fully offline (plain HTML/CSS/JS)

## Getting Started

1. Download or clone this repository:

	 ```bash
	 git clone https://github.com/<your-username>/<your-repo-name>.git
	 ```

2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, etc.).

No build step or server is required.

## Usage

1. Choose a `display` value and Flexbox options in the **Display & Flexbox** card.
2. Adjust `position` and offsets in the **Positioning** card.
3. (Optional) Add extra CSS declarations in **Custom CSS**.
4. See the result in the **Preview** panel.
5. Click **Copy CSS** to copy the generated styles for `#previewBox`.

## Development

- `index.html` – main UI and layout
- `styles.css` – styling for the app and preview
- `app.js` – logic to sync controls, state, preview, and generated CSS

## Screenshots

Add screenshots here.

## License

Add your preferred license here (for example, MIT).

