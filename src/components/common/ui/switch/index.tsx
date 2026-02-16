import React from 'react'

interface SwitchInputProps {
    initialValue?: boolean;
    onChange?: (value: boolean) => void;
}
const SwitchInput: React.FC<SwitchInputProps> = ({ initialValue, onChange }) => {
    const [checked, setChecked] = React.useState(initialValue);

    const toggleSwitch = () => {
        const newValue = !checked;
        setChecked(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <div className={`relative w-12 h-6 bg-gray-200 rounded-full cursor-pointer ${checked ? 'bg-blue-600' : 'bg-slate-200'}`} onClick={toggleSwitch}>
            <div className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${checked ? 'translate-x-full' : ''}`}></div>
        </div>

    );
}

export default SwitchInput
