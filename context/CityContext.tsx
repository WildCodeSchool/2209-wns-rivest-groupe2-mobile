import { createContext, useState } from "react";

export interface ICity {
  name: string;
  id: number;
  coordinates: number[];
}

interface ICityContext {
  city: ICity;
  setCity: React.Dispatch<React.SetStateAction<ICity>>;
}

export const CityContext = createContext<ICityContext | null>({
  city: null,
  setCity: () => {},
});

export const CityContextProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [city, setCity] = useState<ICity>({
    name: "Paris",
    id: 1,
    coordinates: [48.860161, 2.350041],
  });

  return (
    <CityContext.Provider value={{ city, setCity }}>
      {children}
    </CityContext.Provider>
  );
};
