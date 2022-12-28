import {createContext, useContext, useState} from "react";


const DishContext = createContext({})

const DishContextProvider = ({children}) => {


    const [dish,setDish] = useState(null)




    return (<DishContext.Provider
            value={{
                dish,
                setDish
            }}
        >
            {children}
        </DishContext.Provider>
    )
}

export default DishContextProvider;

export const useDishContext = () => useContext(DishContext);