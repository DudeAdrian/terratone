export const createBackHandler = (navigate, location, path = "/") => () => {
  if (location?.state) {
    navigate(path, { state: location.state });
  } else {
    navigate(path);
  }
};

export const handleBackNavigation = (navigate, location, path = "/") => {
  if (location?.state) {
    navigate(path, { state: location.state });
  } else {
    navigate(path);
  }
};
