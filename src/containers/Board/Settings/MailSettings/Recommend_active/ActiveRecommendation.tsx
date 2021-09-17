import { List } from "@material-ui/core";
import axios from "axios";
import { truncate } from "fs";
import { useEffect, useState } from "react";

interface arrType{
    TYPE:string,
    ACTIVE:number,
    DESCRPITION: string,
    
}

const ActiveRecommendation = () => {
    const [list, setActive] = useState<Array<arrType>>([]);
    const [type, setType] = useState('');

    const checkIfChecked = (value: number) => {
        console.log("duwoc active"+ value);
        if (value == 1) return true;
        return false;
    }
    const getActive = async () => {
        const response = await axios({
            url: `http://localhost:5035/admin/setting/getRecommend`,
            method: 'GET',
        })
        const dtActive = response.data;
        console.log(dtActive);
        setActive(dtActive.details.result);
        console.log(list);
    }
    useEffect(() => {

        getActive();
    }, 
    [])

    const putActive = async (type:String) => {
        const response = await axios({
            url: `http://localhost:5035/admin/setting/setRecommend?TYPE=${type}`,
            method: 'GET',
        })
        alert('Update success');
        
    }
   
    
    return (
        <div className='recomendation_active-container'>
            <div className='recomendation_active-container__filters' >
                
                {list.length > 0 ?
                    list.map(Active =>
                        
                        <div className='recomendation_active-container__filters' >
                        <input style={{ marginTop: '0.5%',marginRight:'1%'}} type="radio" 
                        onChange={event => setType(event.target.value)} id="recommend" name="recommend1"  value={Active.TYPE} 
                        defaultChecked={checkIfChecked(Active.ACTIVE)}
                        ></input>
                            <label htmlFor="recommend">{Active.DESCRPITION}</label><br></br>
                        </div>
                    )
                    : null}
                    <div className='recomendation_active-container__filters__filter'>
                    <button onClick={() => { putActive(type) }}
                        >Apply</button>
                    
                    </div>
            </div>
        </div>
    )
}

export default ActiveRecommendation;
