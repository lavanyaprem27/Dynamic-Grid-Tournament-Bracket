# ABOUT
This program was made as a first-semester final project for my High School AP Computer Science Principles Class. The goal was to make an interactive bracket for our class's Super Smash Bros. tournament. Rather than going with a traditional branching tree design, I wanted to use a grid to efficiently organize and display all the pairings for a round. This worked out quite conveniently, as my class had 32 students. 
**Note**: I've censored my classmates' names by replacing them with characters from my favorite TV show, LEGO Ninjago.

# FEATURES
* Grid-based interface that displays all round pairings in a convenient manner
* Separate round- and match-specific displays for ease of access
* Uniquely colored square icon assigned to each player
* Visual indicators (tile outline, player square brightness, button color) for winner selection status
* Randomly assigned pairings at the beginning of each round
* Ability to edit match results from previous rounds. Only the matches in following rounds affected by the change are reset.
* Silly end screen showing a podium of the best 4 players.

# TECHNICAL DETAILS
This program was made with HTML, CSS, and JavaScript. The graphics were mainly made using JavaScript and the Canvas API, except for the header bar and buttons. Because this project was my first serious exposure to integrating JavaScript with HTML, I intentionally kept the graphics simple to focus on the underlying logic.

# INSTRUCTIONS
1. Click on any tile to open up the match-specific view. Tiles outlined in red indicate a winner has not been selected, while tiles outlined in green signify pairings with a chosen winner.
2. Select the winning player in a match by clicking on the button with their name. The button will turn pale yellow to show the selection. The winner's square icon will brighten, and the loser's square icon will dim to also show the match result.
3. While in match-specific view, click the _VIEW ROUND_ button to return back to the round-specific view. The _NEXT MATCH_ button, which is available only after a winner is selected, will automatically open the match-specific view for the next match.
4. After all the winners in a round have been declared, the round-specific page of the next round will automatically open. Continue evaluating matches and selecting the corresponding winners.
5. To edit the outcome of any previous match, click the _PREVIOUS MATCH_ button available in the top bar of the round-specific view. After changing the outcome, click the _NEXT MATCH_ button to go back to the current round. Any rounds affected by the altered outcome will be reset. All other matches will remain the same.
6. Once the tournament has been completed, a silly little end page will be displayed. The square icon of the winner will appear on the 1st place podium, the runner-up on the 2nd place podium, and the two semi-finalists on the 3rd place podium.
