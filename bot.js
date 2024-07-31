const { Telegraf } = require("telegraf");
const fs = require("fs");
const path = require("path");
const moment = require("moment");


const bot = new Telegraf("Your-Bot-Token-Here");

// can change another
const dataFile = path.join(__dirname, "finance_data.json"); 


function readData() {
  if (fs.existsSync(dataFile)) {
    const data = fs.readFileSync(dataFile, "utf8");
    try {
      const parsedData = JSON.parse(data);
      return {
        expenses: parsedData.expenses || [],
        incomes: parsedData.incomes || [],
        savingGoals: parsedData.savingGoals || []
      };
    } catch (e) {
      console.error("Error parsing JSON data:", e);
      return { expenses: [], incomes: [], savingGoals: [] };
    }
  }
  return { expenses: [], incomes: [], savingGoals: [] };
}


function writeData(data) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Error writing JSON data:", e);
  }
}


bot.start((ctx) => {
  console.log("Received start command");
  return ctx.reply(
    "👋 Welcome to the personal finance management bot! Use /help to see available commands."
  );
});


bot.help((ctx) => {
  console.log("Received help command");
  return ctx.reply(`
📝 /expense <amount> <description> - Add an expense
💵 /income <amount> <description> - Add an income
📊 /report - View financial report
🗑️ /reset - Clear all data
🎯 /goal <amount> - Set a saving goal
🔍 /goalreport - View current saving goal
🕶️ /statistics <start_date> <end_date> - View statistics for a given period
  `);
});


bot.command("expense", (ctx) => {
  const userId = ctx.from.id;
  const [amount, ...description] = ctx.message.text.split(" ").slice(1);
  if (!amount || description.length === 0) {
    return ctx.reply("❌ Please enter the command in the format: /expense <amount> <description>");
  }
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return ctx.reply("❌ Invalid amount. Please enter a positive number.");
  }
  const data = readData();
  data.expenses.push({
    user_id: userId,
    amount: parsedAmount,
    description: description.join(" "),
    date: new Date().toISOString()
  });
  writeData(data);
  ctx.reply("✅ Expense added!");
});

bot.command("income", (ctx) => {
  const userId = ctx.from.id;
  const [amount, ...description] = ctx.message.text.split(" ").slice(1);
  if (!amount || description.length === 0) {
    return ctx.reply("❌ Please enter the command in the format: /income <amount> <description>");
  }
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return ctx.reply("❌ Invalid amount. Please enter a positive number.");
  }
  const data = readData();
  data.incomes.push({
    user_id: userId,
    amount: parsedAmount,
    description: description.join(" "),
    date: new Date().toISOString()
  });
  writeData(data);
  ctx.reply("✅ Income added!");
});


bot.command("report", (ctx) => {
  const userId = ctx.from.id;
  const data = readData();

 
  let totalExpenses = 0;
  if (data.expenses && data.expenses.length > 0) {
    totalExpenses = data.expenses.reduce(
      (sum, expense) => sum + parseFloat(expense.amount),
      0
    );
  }

  
  let totalIncomes = 0;
  if (data.incomes && data.incomes.length > 0) {
    totalIncomes = data.incomes.reduce(
      (sum, income) => sum + parseFloat(income.amount),
      0
    );
  }

  
  const balance = totalIncomes - totalExpenses;

  
  const formattedTotalExpenses = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(totalExpenses);
  const formattedTotalIncomes = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(totalIncomes);
  const formattedBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(balance);

  
  let report = `📊 Financial Report:\n\n`;
  report += `📉 Expenses:\n`;
  if (data.expenses && data.expenses.length > 0) {
    data.expenses.forEach((expense) => {
      report += `- ${new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(parseFloat(expense.amount))}: ${
        expense.description
      } (${moment(expense.date).format("MM/DD/YY HH:mm")})\n`;
    });
  }
  report += `\n📈 Income:\n`;
  if (data.incomes && data.incomes.length > 0) {
    data.incomes.forEach((income) => {
      report += `+ ${new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(parseFloat(income.amount))}: ${income.description} (${moment(
        income.date
      ).format("MM/DD/YY HH:mm")})\n`;
    });
  }
  report += `\n💰 Total Expenses: ${formattedTotalExpenses}\n`;
  report += `💸 Total Income: ${formattedTotalIncomes}\n`;
  report += `💵 Balance: ${formattedBalance}`;

  
  ctx.reply(report);
});


bot.command("reset", (ctx) => {
  console.log("Clearing all data");
  const data = { expenses: [], incomes: [], savingGoals: [] };
  writeData(data);
  ctx.reply("✅ All expense and income information has been cleared!");
});


bot.command("goal", (ctx) => {
  console.log("Setting saving goal");
  const amount = parseFloat(ctx.message.text.split(" ")[1]);
  if (isNaN(amount) || amount <= 0) {
    return ctx.reply("❌ Invalid amount. Please enter a positive number.");
  }
  const data = readData();
  data.savingGoals = [{ amount: amount }];
  writeData(data);
  ctx.reply(`💰 Saving goal set: ${amount} USD`);
});


bot.command("goalreport", (ctx) => {
  console.log("Viewing saving goal report");
  const data = readData();
  const totalSaved = data.incomes.reduce(
    (sum, income) => sum + income.amount,
    0
  );
  const goalAmount =
    data.savingGoals.length > 0 ? data.savingGoals[0].amount : 0;
  const progress =
    goalAmount > 0 ? ((totalSaved / goalAmount) * 100).toFixed(2) : 0;

  let report = `🎯 Saving Goal Report:\n\n`;
  report += `Total Saved: ${totalSaved} USD\n`;
  report += `Saving Goal: ${goalAmount} USD\n`;
  report += `Progress: ${progress}%`;

  ctx.reply(report);
});


function calculateStatistics(data, startTime, endTime) {
  const filteredExpenses = data.expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= startTime && expenseDate <= endTime;
  });

  const filteredIncomes = data.incomes.filter((income) => {
    const incomeDate = new Date(income.date);
    return incomeDate >= startTime && incomeDate <= endTime;
  });

  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const totalIncomes = filteredIncomes.reduce(
    (sum, income) => sum + income.amount,
    0
  );

  return { filteredExpenses, filteredIncomes, totalExpenses, totalIncomes };
}


bot.command("statistics", (ctx) => {
  const [startDate, endDate] = ctx.message.text.split(" ").slice(1);
  const startTime = moment(startDate, "YYYY-MM-DD").startOf("day").toDate();
  const endTime = moment(endDate, "YYYY-MM-DD").endOf("day").toDate();

  if (!startTime || !endTime || isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    return ctx.reply("❌ Please enter valid start and end dates in the format YYYY-MM-DD.");
  }

  const data = readData();
  const { totalExpenses, totalIncomes } = calculateStatistics(data, startTime, endTime);

  let report = `📊 Statistics from ${moment(startTime).format("YYYY-MM-DD")} to ${moment(endTime).format("YYYY-MM-DD")}:\n\n`;
  report += `📉 Total Expenses: ${totalExpenses} USD\n`;
  report += `📈 Total Income: ${totalIncomes} USD`;

  ctx.reply(report);
});


bot.launch().then(() => {
  console.log("T7C siuu...");
});
