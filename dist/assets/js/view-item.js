import { items } from "./modules/items.mjs"; // Articles on sale
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

await showItem();

async function showItem() {
  // console.debug(`showing item `);
  const
  // call argument
  itemIdArg = await Qworum.getData('item id'),
  itemId    = itemIdArg.value, // int
  item      = items[itemId],

  // UI
  closeButton = document.getElementById('close'),
  title       = document.getElementById('item-title'),
  details     = document.getElementById('item-details');

  // console.debug(`item id: ${itemId} `);

  title.innerText   = item.title;
  details.innerText = item.details;

  // closeButton.onclick(async (event) => {
  //   console.debug('close button clicked');
  //   event.preventDefault();
  //   await Qworum.eval(
  //     Script(
  //       Return(Json(itemId))
  //     )
  //   );
  // });

  closeButton.addEventListener('click', (event) => {
    // console.debug('close button clicked');
    // event.preventDefault();
    Qworum.eval(
      Script(
        // Fault('* origin')
        Return(Json(itemId))
      )
    );
  });

}
