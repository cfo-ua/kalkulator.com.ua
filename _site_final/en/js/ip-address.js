document.addEventListener("DOMContentLoaded", async () => {
  const wrapper = document.getElementById("ip-address-wrapper");
  wrapper.innerHTML = `
    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #007bff;">
      <p style="margin: 0; color: #495057;">Loading IP information...</p>
    </div>
  `;

  try {
    // Try primary service first
    let data;
    try {
      const res = await fetch("https://ipapi.co/json/", {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!res.ok) throw new Error("Primary service failed");
      data = await res.json();
    } catch (primaryError) {
      // Fallback to secondary service
      console.warn("Primary IP service failed, trying fallback:", primaryError);
      const fallbackRes = await fetch("https://ipinfo.io/json", {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!fallbackRes.ok) throw new Error("Fallback service also failed");
      const fallbackData = await fallbackRes.json();
      
      // Map fallback data to expected format
      data = {
        ip: fallbackData.ip,
        country_name: fallbackData.country,
        country_code: fallbackData.country,
        region: fallbackData.region,
        city: fallbackData.city,
        org: fallbackData.org,
        version: fallbackData.ip && fallbackData.ip.includes(':') ? 6 : 4
      };
    }

    if (!data.ip) {
      throw new Error("No IP address returned");
    }

    // Format the display
    const formatField = (label, value, unit = '') => {
      if (!value || value === 'undefined' || value === 'null') return '';
      return `<li><strong>${label}:</strong> ${value}${unit}</li>`;
    };

    const getConnectionType = (org) => {
      if (!org) return '';
      const orgLower = org.toLowerCase();
      if (orgLower.includes('mobile') || orgLower.includes('cellular')) return ' (Mobile)';
      if (orgLower.includes('fiber') || orgLower.includes('fibre')) return ' (Fiber)';
      if (orgLower.includes('cable')) return ' (Cable)';
      if (orgLower.includes('dsl') || orgLower.includes('adsl')) return ' (DSL)';
      if (orgLower.includes('satellite')) return ' (Satellite)';
      return '';
    };

    const connectionType = getConnectionType(data.org);

    wrapper.innerHTML = `
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
        <ul style="list-style: none; padding: 0; margin: 0; line-height: 1.8;">
          ${formatField('IP Address', data.ip)}
          ${formatField('Country', data.country_name && data.country_code ? 
            `${data.country_name} (${data.country_code})` : 
            (data.country_name || data.country_code))}
          ${formatField('Region/State', data.region)}
          ${formatField('City', data.city)}
          ${formatField('ISP/Provider', data.org ? data.org + connectionType : '')}
          ${formatField('ASN', data.asn)}
          ${formatField('IP Version', data.version ? `IPv${data.version}` : '')}
          ${formatField('Network', data.network)}
        </ul>
        
        <div style="margin-top: 15px; padding: 10px; background: #e7f3ff; border-radius: 6px; font-size: 0.9em; color: #0066cc;">
          <strong>Note:</strong> Location information is approximate and based on your ISP's registration data. 
          VPN services may show different locations.
        </div>
      </div>
    `;

    // Add additional security info if needed
    if (data.ip) {
      const isPrivateIP = isPrivateIPAddress(data.ip);
      if (isPrivateIP) {
        wrapper.innerHTML += `
          <div style="margin-top: 10px; padding: 10px; background: #fff3cd; border-radius: 6px; border-left: 4px solid #ffc107; font-size: 0.9em; color: #856404;">
            <strong>Notice:</strong> This appears to be a private IP address, which suggests you may be behind a NAT or proxy.
          </div>
        `;
      }
    }

  } catch (err) {
    console.error("IP lookup failed:", err);
    wrapper.innerHTML = `
      <div style="background: #f8d7da; padding: 15px; border-radius: 8px; border-left: 4px solid #dc3545; color: #721c24;">
        <strong>Unable to determine IP and geolocation.</strong><br>
        <small>This may be due to network restrictions, ad blockers, or service unavailability. 
        Try disabling browser extensions or checking your network connection.</small>
      </div>
    `;
  }
});

// Helper function to check if IP is private
function isPrivateIPAddress(ip) {
  const parts = ip.split('.');
  if (parts.length !== 4) return false; // Not IPv4
  
  const first = parseInt(parts[0]);
  const second = parseInt(parts[1]);
  
  // Private IP ranges
  if (first === 10) return true;
  if (first === 172 && second >= 16 && second <= 31) return true;
  if (first === 192 && second === 168) return true;
  if (first === 127) return true; // Localhost
  
  return false;
}