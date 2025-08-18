# TaskTracker BPHC

This is a task management application built with Next.js, React, and Tailwind CSS, designed for the BITS Pilani, Hyderabad Campus Placement Unit. It allows Joint Placement Team (JPT) members to create and assign tasks, and for Associates to view and complete them.

## How to Extract and Run This Project Locally

You cannot download a ZIP file directly from this environment. To run this project on your own computer, you need to manually recreate the files and folders. Follow these steps:

### Step 1: Set Up the Project Folder

1.  Open a terminal or command prompt on your computer.
2.  Create a new folder for your project. You can name it whatever you like.
    ```bash
    mkdir task-tracker-app
    ```
3.  Navigate into the new folder:
    ```bash
    cd task-tracker-app
    ```

### Step 2: Recreate the File Structure and Copy the Code

Now, you need to create the files and folders exactly as they are in this project. You can see the full list of files and their contents in the project panel.

**Important:** The most critical files you need to copy are:
- `package.json` (This lists all the project dependencies)
- `tailwind.config.ts`
- `next.config.ts`
- `tsconfig.json`
- The entire `src/` directory, including all its sub-folders and files (`app`, `components`, `lib`, etc.).

For each file in the project, create a new file with the **same name** and in the **same folder location** on your computer. Then, copy the entire content of that file from here and paste it into the new file on your machine.

### Step 3: Install Dependencies

Once you have created the `package.json` file and the rest of the project structure, you need to install all the required packages. Run the following command in your terminal from the project's root directory:

```bash
npm install
```

This command reads the `package.json` file and downloads all the necessary libraries (like React, Next.js, Tailwind CSS, etc.) into a `node_modules` folder.

### Step 4: Run the Development Server

After the installation is complete, you can start the development server:

```bash
npm run dev
```

This will launch the application, and you'll see a message in your terminal, usually:
`ready - started server on 0.0.0.0:9002, url: http://localhost:9002`

You can now open `http://localhost:9002` in your web browser to see the running application!

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **UI**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
- **AI**: [Google Genkit](https://firebase.google.com/docs/genkit)
