import { authServiceUrl } from './modules/dependency-urls.mjs';
import { requireUser } from "./modules/require-user.mjs";
import { Employees } from "./modules/employees.mjs";
import { QworumScript, Qworum } from './deps.mjs';

const
// Data values
Json         = QworumScript.Json.build,
SemanticData = QworumScript.SemanticData.build,
// Instructions
Data     = QworumScript.Data.build,
Return   = QworumScript.Return.build,
Sequence = QworumScript.Sequence.build,
Goto     = QworumScript.Goto.build,
Call     = QworumScript.Call.build,
Fault    = QworumScript.Fault.build,
Try      = QworumScript.Try.build,
// Script
Script = QworumScript.Script.build;

build();

async function build() {
  console.debug('[pick team]');

  const
  user = await requireUser(),   // Auth wall

  employees      = await Employees.read(),
  employee       = employees.findByUser(user),
  supervisedTeam = employees.withSupervisor(employee),

  returnButton = document.getElementById('return-button'),
  teamList     = document.getElementById('team-list'),
  pickedTeamUi = document.getElementById('picked-team');

  let pickedTeam     = [];

  pickedTeamUi.dataset.userIds = '[]';

  console.debug('[pick team] user:',user);
  console.debug('[pick team] employee:',employee);
  console.debug('[pick team] supervisedTeam:',supervisedTeam);

  returnButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const
    pickedUsers     = pickedTeam.map(e => e.user),
    pickedUsersJson = pickedUsers.map(u => u.toJSON());

    await Qworum.eval(Script(
      Return(Json(pickedUsersJson))
    ));
  });

  // <md-list-item
  //     type="link"
  //     href="https://google.com/search?q=buy+kiwis&tbm=shop"
  //     target="_blank">
  //   <div slot="headline">Shop for Kiwis</div>
  //   <div slot="supporting-text">This will link you out in a new tab</div>
  //   <md-icon slot="end">open_in_new</md-icon>
  // </md-list-item>

  // // Member details
  for (const member of supervisedTeam) {
    const
    memberUi = {
      all           : document.createElement('md-list-item'),
      headline      : document.createElement('div'),
      supportingText: document.createElement('div'),
      icon          : document.createElement('md-icon'),
    },
    userWasAdded = () => {
      return memberUi.icon.innerText === 'person_remove';
    },
    iconToggle = () => {
      if (memberUi.icon.innerText === 'person_add') {
        memberUi.icon.innerText = 'person_remove';
      } else {
        memberUi.icon.innerText = 'person_add';
      }
    };
  
    memberUi.headline.setAttribute('slot', 'headline');
    memberUi.headline.innerText = member.user.name;

    memberUi.supportingText.setAttribute('slot', 'supporting-text');
    memberUi.supportingText.innerText = `Employee ID: ${member.id}, User ID: ${member.user.id}`;

    memberUi.icon.setAttribute('slot', 'end');
    memberUi.icon.innerText = 'person_add';

    memberUi.all.appendChild(memberUi.headline);
    memberUi.all.appendChild(memberUi.supportingText);
    memberUi.all.appendChild(memberUi.icon);

    memberUi.all.addEventListener('click', event => {
      if (userWasAdded()) {
        console.debug(`removing employee`,member);
        pickedTeam = pickedTeam.filter(e => e.id !== member.id);
      } else {
        console.debug(`adding employee`,member);
        pickedTeam.push(member);
      }
      pickedTeamUi.innerText = pickedTeam.map(e => e.user.name).join(', ');
      iconToggle();
    });

    teamList.appendChild(memberUi.all);
  }

}

