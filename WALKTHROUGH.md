# Two-Minute Walkthrough

Use this script when recording the capstone proof video:

1. Open the public site and show the responsive internship board, search field, domain/work-mode filters, result count, and internship cards.
2. Open an internship with **View Details**, then use the keyboard to close the dialog and open the application form.
3. Submit an invalid email or unsafe portfolio URL and show the client-side validation message.
4. Submit a valid application locally at `http://localhost:3000/` and show the success message. Submit it again with the same email to show the server-side duplicate rejection.
5. Open `/health` and show the database readiness response.
6. Show `CAPSTONE_REPORT.md`, the 4 passing automated tests, the seed output, and the security checklist.

The public GitHub Pages site supports browsing and filtering. Live application persistence requires the Node API to be deployed separately because GitHub Pages cannot execute Express or SQLite.