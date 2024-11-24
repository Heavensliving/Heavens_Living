import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddAddOnsItem() {
    const admin = useSelector(store => store.auth.admin);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [inputs, setInputs] = useState({
        Itemname: '',
        prize: '',
        Description: '',
        image: '',
        status: 'unavailable',
    });
    //const [message, setMessage] = useState('');

    const handleChange = ({ target: { name, value } }) => {
        setInputs(prevInputs => ({ ...prevInputs, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/adOn/add-adOn`,
                inputs,
                { headers: { 'Authorization': `Bearer ${admin.token}` } }
            );
            
            if (response.status === 201) {
                toast.success('Add-on Item Added Successfully!', { autoClose: 500 });
                setInputs({ Itemname: '', prize: '', Description: '', image: '', status: 'unavailable' });
                setTimeout(() => {
                    navigate('/add-ons');
                }, 1000);
            }
        } catch (error) {
            console.error('There was an error adding the item:', error);
            toast.error('Failed to Add Add-on Item.', { autoClose: 500 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8 mt-10">
            <form onSubmit={handleSubmit} className="space-y-6">
                {['Itemname', 'prize', 'Description', 'image'].map((field, index) => (
                    <div className="relative" key={index}>
                        <input
                            type={field === 'prize' ? 'number' : 'text'}
                            id={field}
                            name={field}
                            value={inputs[field]}
                            onChange={handleChange}
                            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-0"
                            placeholder=" "
                            required
                            min={field === 'prize' ? '1' : undefined}
                        />
                        <label
                            htmlFor={field}
                            className="absolute top-3 text-gray-500 transform -translate-y-6 scale-75 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                    </div>
                ))}
                <ToastContainer />
                <button
                    type="submit"
                    className={`w-full bg-side-bar text-white font-bold py-3 rounded-lg hover:bg-[#373082] transition duration-300 flex items-center justify-center ${loading ? ' cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? (
                        <div className="spinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
                    ) : (
                        'Add Item'
                    )}
                </button>
            </form>
        </div>
    );
}

export default AddAddOnsItem;
