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

showItems();

function showItems() {
  // console.debug(`[home] showing ${items.length} items`);
  const contentArea = document.getElementById('items');

  for (let itemId = 0; itemId < items.length; itemId++) {
    // console.debug(`[home] showing item ${itemId}`);
    const
    item   = items[itemId],
    li     = document.createElement('li'),
    button = document.createElement('button');

    button.className = 'item-title';
    button.innerText = item.title;
    li.appendChild(button);
    contentArea.appendChild(li);

    button.addEventListener('click', async () => {
      await Qworum.eval(
        Script(
          Sequence(
            // Try(
            //   Call(
            //     '@', '../view-item/', 
            //     { name: 'item id', value: Json(itemId) }
            //   ),
            //   [{catch: [], do: Goto()}]
            // ),
            // Goto(),
            Call('@', '../view-item/', { name: 'item id', value: Json(itemId) }),
            Goto(),
          )
        )
      );
    });
  }
}
