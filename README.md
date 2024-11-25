# Personal Finance Management Bot - @T7C

## Overview

**Finance-Manager-Bot** is a Telegram bot for personal finance management. It helps users track expenses, record incomes, set saving goals, and generate financial reports and statistics. Manage your finances easily via Telegram with real-time updates.

## Features

- **Add Expenses**: Record and categorize your expenses.
- **Add Income**: Track your income and its source.
- **Generate Report**: Get a summary of your expenses and incomes.
- **Set Saving Goals**: Define your saving goals and track progress.
- **View Saving Goal Report**: Check your saving goal progress.
- **View Statistics**: Analyze your financial data over a specified period.
- **Reset Data**: Clear all stored data.

## Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/tanbaycu/finance-manager-bot.git
    cd finance-manager-bot
    ```

2. **Install dependencies**:

    Ensure you have Node.js and npm installed. Then run:

    ```bash
    npm install
    ```

3. **Set up your bot token**:

    Replace `"YOUR_BOT_TOKEN"` in the `bot.js` file with your actual Telegram bot token.

    ```javascript
    const bot = new Telegraf("YOUR_BOT_TOKEN");
    ```

4. **Configure admin user ID**:

    Set the `ADMIN_USER_ID` in the `bot.js` file to the Telegram user ID of the admin:

    ```javascript
    const ADMIN_USER_ID = 123456789; // Replace with your Telegram user ID
    ```

5. **Set up database connection**:

    If you want to use a MySQL database, update the database configuration in `bot.js` with your database credentials:

    ```javascript
    const db = mysql.createConnection({
      host: "localhost",
      user: "your-username",
      password: "your-password",
      database: "your-database"
    });
    ```

6. **Run the bot**:

    ```bash
    node bot.js
    ```

## Configuration

- **Data Storage**: The bot uses a `finance_data.json` file to store expenses, incomes, and saving goals. Ensure this file exists in the root directory if you're not using a database.

## Commands

- `/start` - Welcome message and instructions.
- `/help` - List available commands and their usage.
- `/expense <amount> <description>` - Add an expense.
- `/income <amount> <description>` - Add an income.
- `/report` - Generate a financial report.
- `/reset` - Clear all recorded data.
- `/goal <amount>` - Set a saving goal.
- `/goalreport` - View the current saving goal report.
- `/statistics <start_date> <end_date>` - View financial statistics for a specified date range.

## Example Usage

- **Add an Expense**: `/expense 50 Dinner`
- **Add an Income**: `/income 200 Salary`
- **Generate Report**: `/report`
- **Set Saving Goal**: `/goal 1000`
- **View Saving Goal Report**: `/goalreport`
- **View Statistics**: `/statistics 2024-01-01 2024-07-31`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or suggestions, please contact [tranminhtan4953@gmail.com](mailto:tranminhtan4953@gmail.com).
