let price = 3.26;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100],
];

const getChange = document.getElementById("change-due");
const cash = document.getElementById("cash");

const formatResults = (status, change) => {
  getChange.innerText = `Status: ${status}`;
  change.forEach((money) => {
    getChange.innerText += `${money[0]}: $${money[1]}\n`;
  });
  return;
};

const checkCid = () => {
  if (Number(cash.value) < price) {
    alert("Customer does not have enough money to purchase the item");
    cash.value = "";
    return;
  }

  if (Number(cash.value) === price) {
    getChange.innerText = "No change due - customer paid with exact cash";
    cash.value = "";
    return;
  }

  let changeDue = Number(cash.value) - price;
  let flippedCid = [...cid].reverse();
  let currency = [100, 20, 10, 5, 1, 0.25, 0.1, 0.05, 0.01];
  let result = { status: "OPEN", change: [] };
  let drawerTotal = 0;
  for (const item of cid) {
    drawerTotal += item[1];
  }
  drawerTotal = parseFloat(drawerTotal.toFixed(2));

  if (drawerTotal < changeDue) {
    return (getChange.innerHTML = "<p>Status: INSUFFICIENT_FUNDS</p>");
  }

  if (drawerTotal === changeDue) {
    result.status = "CLOSED";
  }

  for (let i = 0; i <= flippedCid.length; i++) {
    if (changeDue > currency[i] && changeDue > 0) {
      let count = 0;
      let total = flippedCid[i][1];
      while (total > 0 && changeDue >= currency[i]) {
        total -= currency[i];
        changeDue = parseFloat((changeDue -= currency[i]).toFixed(2));
        count++;
      }
      if (count > 0) {
        result.change.push([flippedCid[i][0], count * currency[i]]);
      }
    }
  }
  if (changeDue > 0) {
    return (getChange.innerHTML = "<p>Status: INSUFFICIENT_FUNDS</p>");
  }

  formatResults(result.status, result.change);
  updateCid(result.change);
};

const checkResults = () => {
  if (!cash.value) {
    return;
  }
  checkCid();
};

const updateCid = (change) => {
  const currencyNameMap = {
    PENNY: "Pennies",
    NICKEL: "Nickels",
    DIME: "Dimes",
    QUARTER: "Quarters",
    ONE: "Ones",
    FIVE: "Fives",
    TEN: "Tens",
    TWENTY: "Twenties",
    "ONE HUNDRED": "Hundreds",
  };

  if (change) {
    change.forEach((changeArr) => {
      const targetArr = cid.find((cidArr) => cidArr[0] === changeArr[0]);
      targetArr[1] = parseFloat((targetArr[1] - changeArr[1]).toFixed(2));
    });
  }

  cash.value = "";
  document.getElementById("price").textContent = `Total: $${price}`;
  document.getElementById(
    "show-cid"
  ).innerHTML = `<h5><strong>Change in drawer:</strong></h5>
    ${cid
      .map((money) => `<p>${currencyNameMap[money[0]]}: $${money[1]}</p>`)
      .join("")}
  `;
};

document.getElementById("purchase-btn").addEventListener("click", checkResults);

cash.addEventListener("click", checkResults);

updateCid();
