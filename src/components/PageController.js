import { changePage } from "../reducers/transactionReducer";
import { useSelector, useDispatch } from "react-redux";
import { useMemo } from "react";
import LeftArrow from "../assets/images/leftArrow.png";
import RightArrow from "../assets/images/rightArrow.png";
import { Button, ButtonGroup } from "react-bootstrap";
import RegularButton from "./RegularButton";

const PageController = () => {
  const dispatch = useDispatch();
  const typeGetter = (type) => (store) => store.transactionReducer[type];

  const totalPages = useSelector(typeGetter("totalPages"));
  const currentPage = useSelector(typeGetter("currentPage"));

  const buttons = useMemo(() => {
    const mass = [];
    const maxButtonsNumber = 7;
    const dotButtonStep = 2;
    //! used to get to know if button with currentPage index is located in the center
    const buttonsCenter = Math.floor(maxButtonsNumber / 2);

    function addDotButtonsToTheStartAndEnd() {
      mass.push(
        <Button
          key="dots-start"
          variant="outline-info"
          onClick={() => dispatch(changePage(currentPage - dotButtonStep))}
        >
          ...
        </Button>
      );

      //! button coefficients which are located between `dots-start` and `dots-end` buttons
      const numbers = [-1, 0, 1];
      numbers.forEach((number) => {
        mass.push(
          <RegularButton
            key={currentPage + number}
            i={currentPage + number}
            currentPage={currentPage}
          />
        );
      });

      mass.push(
        <Button
          key="dots-end"
          variant="outline-info"
          onClick={() => dispatch(changePage(currentPage + dotButtonStep))}
        >
          ...
        </Button>
      );
    }

    function addDotButtonsToTheStart() {
      mass.push(
        <Button
          onClick={() =>
            dispatch(
              changePage(totalPages-2-5)
            )
          }
          key="dots-start"
          variant="outline-info"
        >
          ...
        </Button>
      );
      //! one unit used make it able to work with array , second value - 5 is to calculate button index starting from button with dots
      const decreaseBy = 1 + 5;
      for (let i=totalPages-decreaseBy;i<totalPages;i++) {
        mass.push(<RegularButton {...{ currentPage, i }} key={i} />);
      }
    }

    function addDotButtonsToTheEnd() {
      //! one unit to turn into index for array , second unit for freeing  the place for dot button
      const decreaseBy = 1 + 1;

      for (let i = 0; i < maxButtonsNumber - decreaseBy; i++) {
        mass.push(<RegularButton {...{ currentPage, i }} key={i} />);
      }

      mass.push(
        <Button
          onClick={() => dispatch(changePage(maxButtonsNumber - decreaseBy))}
          key="dots-end"
          variant="outline-info"
        >
          ...
        </Button>
      );
    }

    if (totalPages > maxButtonsNumber) {
      const addDotsToTheStart = currentPage > buttonsCenter;
      const addDotsToTheEnd = totalPages - 1 - currentPage > buttonsCenter;

      if (addDotsToTheEnd && addDotsToTheStart) addDotButtonsToTheStartAndEnd();
      else if (addDotsToTheStart) addDotButtonsToTheStart();
      else if (addDotsToTheEnd) addDotButtonsToTheEnd();

    } else {
      for (let i = 0; i < totalPages; i++) {
        mass.push(<RegularButton {...{ currentPage, i }} key={i} />);
      }
    }

    return mass;
  },[totalPages,currentPage]);

  const rightCLickHandler = () => {
    if (currentPage === totalPages - 1) return;
    dispatch(changePage(currentPage + 1));
  };

  const leftClickHandler = () => {
    if (currentPage === 0) return;
    dispatch(changePage(currentPage - 1));
  };

  return (
    <div className="center">
      <ButtonGroup>
        <Button onClick={leftClickHandler} variant="info" size="sm">
          <img src={LeftArrow} className="arrow" />
        </Button>
        {buttons}
        <Button onClick={rightCLickHandler} variant="info" size="sm">
          <img src={RightArrow} className="arrow" />
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default PageController;