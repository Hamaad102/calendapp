const OrangeButton = {
  background: 'linear-gradient(45deg, tomato 5%, darkOrange 90%)',
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white!important',
};

const ButtonStyle = {
  borderColor: 'darkOrange',
  color: 'primary.main',
  '&:hover': {
    backgroundColor: 'primary.main',
    color: 'ghostwhite',
  },
};

export { OrangeButton, ButtonStyle };
