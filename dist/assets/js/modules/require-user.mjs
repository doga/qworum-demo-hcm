import { authServiceUrl } from './dependency-urls.mjs';
import { User } from "./user.mjs";
import { QworumScript, Qworum } from '../deps.mjs';

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

/**
 * Calls an auth service if the user has not signed in.
 * @returns {Promise<User>}
 */
async function requireUser() {
  const user = await Qworum.getData(['@', 'user', 'profile']);
  
  if (user) return new User(user.value.username, user.value.displayName);

  await Qworum.eval(
    Script(
      // Try(
        Sequence(
          Call(['@', 'user'], `${authServiceUrl}sign-in/`),
          Goto(),
        ),

        // Sign-in was cancelled by user
      //   [{
      //     catch: ['cancelled'],
      //     do   : Goto()
      //   }]
      // ),
    )
  );
}

export {requireUser};
