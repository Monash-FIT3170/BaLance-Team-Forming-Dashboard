const getToastSettings = (title, status) => {
    // title: String containing the text to be displayed by the toast
    // status: Controls the style of the toast. Must be either 'success', 'error', 'warning', or 'info'
  return {
    title: title,
    status: status,
    isClosable: true,
    duration: 2000,
    position: 'top',
    variant: 'subtle',
  };
};

export default getToastSettings;
