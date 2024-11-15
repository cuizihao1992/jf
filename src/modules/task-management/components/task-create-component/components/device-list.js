import { html } from 'lit';

export const renderDeviceRows = (deviceRows, addToSelectedDeviceList) => {
  return deviceRows.map(
    (device) => html`
      <tr>
        <td>
          <input type="checkbox" id="device-status-${device.id}" />
          ${device.id}
        </td>
        <td>${device.region}</td>
        <td>${device.type}</td>
        <td><button class="power-status">⚡</button></td>
        <td>${device.status}</td>
        <td>${device.time}</td>
        <td>
          <button
            class="view-button colored-button"
            @click="${addToSelectedDeviceList}"
          >
            查看
          </button>
        </td>
      </tr>
    `
  );
};
