import React, { useState, useRef, useEffect } from 'react';
import SvgContent from './svgcontent';
import PropTypes from "prop-types";

const SingleSelect = ({ options = [], onClose }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        if (onClose) {
            onClose(option);
        }
    };

    return (
        <div className="custom-select-container" ref={dropdownRef}>
            <button
                type="button"
                className="custom-select-display"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOption?.label || 'Select an option'}
                <span className="arrow">
                    {isOpen ? <SvgContent svg_name="dropdownUp" /> : <SvgContent svg_name="dropdownDown" />}
                </span>
            </button>

            {isOpen && (
                <ul className="custom-select-options">
                    {options.map((option) => (
                        <li
                            key={`${option.value ?? option.label}`}
                            className={`custom-select-option ${selectedOption?.value === option.value ? 'selected' : ''}`}
                        >
                            <button
                                type="button"
                                onClick={() => handleSelect(option)}
                                className={`custom-select-option-button ${selectedOption?.value === option.value ? 'selected' : ''}`}
                            >
                                {option.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

SingleSelect.propTypes = {
  options: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SingleSelect;
