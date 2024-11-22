import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const CheckAuth = (Component)=>{
    const Wrapper =(props) =>{
        const admin = useSelector(store => store.auth.admin);
        const navigate = useNavigate();
        useEffect(()=>{
            if(!admin){
                navigate('/login')
            }
        },[admin])
        return <Component {...props} />;
    }
    return  Wrapper;
}

export default CheckAuth