
# Internship Application Tracker

A web application designed to help college students organize and manage their internship applications in one place.

This project was developed for TCSS 490 Artifact 4 at the University of Washington Tacoma. The goal was to create a simple tool that students could use to keep track of internship opportunities, application deadlines, interview progress, and important notes.

## Live Project

**Website:** https://ymo206.github.io/internship-application-tracker/

**GitHub Repository:** https://github.com/ymo206/internship-application-tracker

**Portfolio:** https://ymo206.github.io/tcss490-portfolio/

## Features

The Internship Application Tracker allows users to:

- Add new internship applications.
- Edit existing application information.
- Delete applications they no longer need.
- Track applications through different stages.
- Search for applications by company or position.
- Filter applications by their current status.
- View application statistics on the dashboard.
- Record application dates and deadlines.
- Save job posting links and personal notes.
- Store application information locally in the browser.
- Export and import application data using JSON files.

### Application Statuses

Applications can be organized into five categories:

- **Saved:** Opportunities the user is interested in.
- **Applied:** Applications that have been submitted.
- **Interviewing:** Applications currently in the interview process.
- **Offered:** Applications that resulted in an offer.
- **Rejected:** Applications that were unsuccessful.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Browser Local Storage
- JSON
- Git and GitHub
- GitHub Pages
- Claude Code for AI-assisted development

The project uses plain HTML, CSS, and JavaScript without a backend or external framework.

## How to Use

1. Open the live website.
2. Click the "Add application" button.
3. Enter the company name and internship position.
4. Select the application status.
5. Add application dates, deadlines, links, or notes if needed.
6. Click "Save application."
7. View the application on the dashboard.
8. Use the Edit or Delete buttons to manage applications.
9. Search or filter applications to find specific opportunities.

Application statistics automatically update as applications are added or their statuses change.

## Running the Project Locally

1. Download or clone the GitHub repository.
2. Open the project folder.
3. Open `index.html` in a web browser.

No installation, server, or additional dependencies are required.

## Project Structure

- `index.html` — Dashboard structure and application form.
- `style.css` — Dashboard design and responsive styling.
- `script.js` — Application management and functionality.
- `README.md` — Project documentation.
- `PROJECT-PLAN.md` — Project goals and development plan.
- `DEVELOPMENT-LOG.md` — Development progress and changes.
- `Claude.md` — Instructions for AI-assisted development.


## Testing

The following features have been tested successfully:

- Opening the Add Application form.
- Creating and saving an application.
- Editing application information.
- Updating application statuses.
- Deleting applications.
- Updating dashboard statistics.
- Keeping saved application information after refreshing.
- Displaying the dashboard with the corrected CSS.

Search, filtering, JSON import/export, and mobile responsiveness are implemented features that should also be checked during final testing.

## Data Storage and Privacy

The application uses the browser's localStorage to save internship information.

There is no user account, database server, or cloud synchronization. Application information stays in the browser on the device being used.

Users can export their application information as a JSON file and import it later.

Clearing browser storage may permanently remove saved applications, so users should regularly export backups.

## AI-Assisted Development

Claude Code was used to assist with writing code, debugging issues, and improving the application's functionality.

AI assistance helped with identifying problems and making changes to the project. I reviewed the results and tested the application to understand whether the changes worked as expected.

## Current Project Status

The Internship Application Tracker has been built and deployed successfully.

The main application features are working, and the project is available through GitHub Pages.

The remaining work for Artifact 4 includes collecting feedback from an intended user, documenting any improvements made from that feedback, and completing the project handoff.

## Future Improvements

Possible future improvements include:

- Email or browser reminders for upcoming deadlines.
- Sorting applications by deadline.
- A calendar view for interviews and deadlines.
- More detailed application statistics.
- Improved mobile usability.
- Optional cloud synchronization across devices.

## Course Information

**Course:** TCSS 490 — Portfolio

**University:** University of Washington Tacoma

**Project:** Artifact 4 — Build for Someone Else

**Developer:** Yusuf Mohamoud

## License

Created as an academic portfolio project for TCSS 490.
