const prepareData = (newData, prevData) => {
  if (!newData || !Array.isArray(newData) || !newData[0]) {
    return null;
  }

  // Pre-calculate dimensions to avoid repeated lookups
  const y_old =
    prevData && Array.isArray(prevData) && prevData[0] ? prevData.length : 0;
  const y_new = newData.length;
  const maxSeasons = Math.max(y_new, y_old);

  let old_episodes = 0;
  let new_episodes = 0;

  // Pre-allocate array with known size for better performance
  const preparedData = new Array(maxSeasons + 1);

  for (let i = 0; i < maxSeasons; i++) {
    const prevSeason = prevData?.[i];
    const newSeason = newData[i];

    const x_old = prevSeason?.length || 0;
    const x_new = newSeason?.length || 0;

    const max_len = Math.max(x_new, x_old);
    old_episodes = Math.max(old_episodes, x_old);
    new_episodes = Math.max(new_episodes, x_new);

    // Pre-allocate row array
    const row = new Array(max_len + 1);

    const old_value = x_old === 0 ? 0 : i + 1;
    const new_value = x_new === 0 ? 0 : i + 1;

    row[0] = {
      type: "seasondesc",
      old: old_value,
      new: new_value,
    };

    for (let j = 0; j < max_len; j++) {
      // Direct array access instead of checking existence
      const newValue = newSeason?.[j] || 0;
      const oldValue = prevSeason?.[j] || 0;

      row[j + 1] = {
        type: "episode",
        old: oldValue,
        new: newValue,
      };
    }

    preparedData[i + 1] = row;
  }

  // Create episode description row
  const maxEpisodes = Math.max(old_episodes, new_episodes);
  const ep_desc = new Array(maxEpisodes + 1);

  ep_desc[0] = {
    type: "corner",
    value: "S\\E",
  };

  for (let i = 0; i < maxEpisodes; i++) {
    const old_value = old_episodes > i ? i + 1 : 0;
    const new_value = new_episodes > i ? i + 1 : 0;
    ep_desc[i + 1] = {
      type: "episodedesc",
      old: old_value,
      new: new_value,
    };
  }

  preparedData[0] = ep_desc;

  return preparedData;
};

export { prepareData };
