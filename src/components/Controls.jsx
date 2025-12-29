import './Controls.css';

const FILTERS = [
    { id: 'none', label: 'Normal' },
    { id: 'sepia', label: 'Sepia' },
    { id: 'grayscale', label: 'B&W' },
    { id: 'vintage', label: 'Vintage' },
    { id: 'invert', label: 'Invert' },
];

const Controls = ({
    selectedFilter,
    onSelectFilter,
    borderColor,
    onColorChange,
    onDownloadStrip,
    onDownloadGif,
    onReset,
    hasPhotos
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
                <h3>Border Style</h3>
                <div className="color-picker-wrapper">
                    <input
                        type="color"
                        value={borderColor}
                        onChange={(e) => onColorChange(e.target.value)}
                        className="color-input"
                    />
                    <span className="color-value">{borderColor}</span>
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
        </div>
    );
};

export default Controls;
