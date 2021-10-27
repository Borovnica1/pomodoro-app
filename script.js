const upArrows = document.querySelectorAll('.form-default__arrow--up');
const downArrows = document.querySelectorAll('.form-default__arrow--down');

function incrementValueByOne() {
  const input = this.parentElement.children[0];
  input.value = Number(input.value) + 1;
};

function decrementValueByOne() {
  const input = this.parentElement.children[0];
  if (Number(input.value) > 1) input.value = Number(input.value) - 1;
};

for (let arrow of upArrows) {
  arrow.addEventListener('click', incrementValueByOne);
};

for (let arrow of downArrows) {
  arrow.addEventListener('click', decrementValueByOne);
};
