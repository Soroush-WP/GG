document.getElementById("Generate1").addEventListener("click", () => {
  const loading = document.getElementById("custom-loading");
  const input = document.getElementById("input1").value.trim();
  const output = document.getElementById("input2");

  output.value = "";
  loading.style.display = "flex";

  setTimeout(() => {
    loading.style.display = "none";
    let result;

    const isNumeric = /^-?\d+(\.\d+)?$/.test(input);
    if (isNumeric) {
      const isNegative = input.startsWith("-");
      const absVal = input.replace("-", "");
      const reversed = [...absVal].reverse().join('');
      result = isNegative ? "-" + reversed : reversed;
    } else {
      result = [...input].reverse().join('');
    }

    output.value = result;
  }, 1200);
});

document.getElementById("copy").addEventListener("click", () => {
  const input = document.getElementById("input2");
  input.select();
  input.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("کپی شد: " + input.value);
});