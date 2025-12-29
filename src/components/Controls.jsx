import './Controls.css';

const FILTERS = [
    { id: 'none', label: 'Normal' },
    { id: 'vivid', label: 'Vivid' },
    { id: 'noir', label: 'Noir' },
    { id: 'sepia', label: 'Sepia' },
    { id: 'cool', label: 'Cool' },
    { id: 'warm', label: 'Warm' },
    { id: 'vintage', label: 'Vintage' },
    { id: 'cyber', label: 'Cyber' },
    { id: 'grayscale', label: 'B&W' },
    { id: 'invert', label: 'Invert' },
];

const LAYOUTS = [
    { id: '1-col', label: 'Strip', icon: '▮' },
    { id: '2-col', label: 'Grid 2', icon: '⊞' },
    { id: '3-col', label: 'Grid 3', icon: '▦' },
    { id: '2-row', label: 'Row 2', icon: '⊟' },
    { id: 'big-left', label: 'Left', icon: '▌' },
    { id: 'big-top', label: 'Top', icon: '▀' },
    { id: 'collage-3', label: 'Collage', icon: '▣' },
    { id: 'collage-4', label: 'Quad', icon: '☷' },
];

const Controls = ({
    selectedFilter,
    onSelectFilter,
    borderColor,
    onColorChange,
    onDownloadStrip,
    onDownloadGif,
    onReset,
    hasPhotos,
    layout,
    onSelectLayout,
    textColor,
    onTextColorChange,
    onShareStrip
}) => {
    return (
        <div className="controls-panel">

            <div className="control-group">
                <h3>Filters</h3>
                <div className="filter-grid">
                    {FILTERS.map(filter => (
                        <button
                            key={filter.id}
                            className={`filter-btn ${selectedFilter === filter.id ? 'active' : ''}`}
                            onClick={() => onSelectFilter(filter.id)}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="control-group">
                <h3>Styles</h3>
                <div className="style-controls">
                    <div className="color-picker-wrapper">
                        <label>Border</label>
                        <input
                            type="color"
                            value={borderColor}
                            onChange={(e) => onColorChange(e.target.value)}
                            className="color-input"
                        />
                    </div>
                    <div className="color-picker-wrapper">
                        <label>Text</label>
                        <input
                            type="color"
                            value={textColor}
                            onChange={(e) => onTextColorChange(e.target.value)}
                            className="color-input"
                        />
                    </div>
                </div>
            </div>

            <div className="control-group">
                <h3>Layout</h3>
                <div className="layout-grid">
                    {LAYOUTS.map(l => (
                        <button
                            key={l.id}
                            className={`layout-btn ${layout === l.id ? 'active' : ''}`}
                            onClick={() => onSelectLayout(l.id)}
                            title={l.label}
                        >
                            <span className="layout-icon">{l.icon}</span>
                            <span className="layout-label">{l.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="actions-group">
                <button
                    className="action-btn primary"
                    onClick={onDownloadStrip}
                    disabled={!hasPhotos}
                >
                    Download Strip
                </button>
                <button
                    className="action-btn secondary"
                    onClick={onDownloadGif}
                    disabled={!hasPhotos}
                >
                    Download GIF
                </button>
                <button
                    className="action-btn danger"
                    onClick={onReset}
                    disabled={!hasPhotos}
                >
                    Reset
                </button>
            </div>
        </div >
    );
};

export default Controls;
