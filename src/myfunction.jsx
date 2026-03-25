import { useCallback } from "react";
import { clickMe } from "./util";

export const MyComponent = (comName) => {

    const addValue = useCallback(() => {
        return {
            fname: 'VJS',
            company:comName

        };
    },[comName]);
    
    
    
    
    
    return(
           
             <button onClick={clickMe(addValue)}>Submit</button>
           
           
        )


}