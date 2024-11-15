import { html } from 'lit';

export const renderSelectedDeviceRows = (
  selectedDeviceList,
  removeFromSelectedDeviceList
) => {
  return selectedDeviceList.map(
    (device) => html`
      <tr>
        <td>
          <input type="checkbox" id="selected-device-${device.id}" />
          ${device.id}
        </td>
        <td>方位角: ${device.horizontal}° 仰俯角: ${device.elevation}°</td>
        <td>
          水平角:
          <input type="text" placeholder="输入角度" style="width: 50px;" />
          俯仰角:
          <input type="text" placeholder="输入角度" style="width: 50px;" />
          <button class="nav-button">姿态计算</button>
        </td>
      </tr>
    `
  );
};
