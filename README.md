# vis-network-multiselect
Adds right-click rectangle-based multiselection to vis-network.

## Usage

```javascript
import multiselect from 'vis-network-multiselect'

// Just call once :

multiselect({
  container, // The DOM container of the network
  network, // The vis.Network instance
  nodes, // The vis.DataSet instance for nodes
  strokeColor, // The border color of the selection rectangle
  fillColor // The fill color of the selection rectangle
})
```
